from rest_framework import serializers
from .models import Client, Domain, GlobalSettings, AdminActionLog

class GlobalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlobalSettings
        fields = '__all__'

class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ('id', 'domain', 'is_primary')

class ClientSerializer(serializers.ModelSerializer):
    domains = DomainSerializer(many=True, read_only=True)
    domain_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Client
        fields = ('id', 'schema_name', 'name', 'created_on', 'domains', 'domain_name', 'is_approved', 'is_active')
        read_only_fields = ('created_on',)

    def create(self, validated_data):
        domain_name = validated_data.pop('domain_name', None)
        client = Client.objects.create(**validated_data)
        if domain_name:
            Domain.objects.create(domain=domain_name, tenant=client, is_primary=True)
        return client

class AdminActionLogSerializer(serializers.ModelSerializer):
    admin_username = serializers.ReadOnlyField(source='admin.username')
    
    class Meta:
        model = AdminActionLog
        fields = '__all__'
