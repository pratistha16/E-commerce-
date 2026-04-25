from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegisterSerializer, UserSerializer, NotificationSerializer
from .models import User, Notification

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        
        if user.role == 'VENDOR':
            response_data['message'] = 'Registration successful. Your account is pending admin approval.'
        else:
            response_data['message'] = 'Registration successful. You can now log in.'
            
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

from core.permissions import IsSuperAdmin, IsStaffAdmin
from core.utils import log_admin_action

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdmin]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'phone_number']
    ordering_fields = ['date_joined', 'username']

    def get_permissions(self):
        # Staff can view, but only SuperAdmin can modify/delete
        if self.action in ['list', 'retrieve', 'stats']:
            return [IsStaffAdmin()]
        return [IsSuperAdmin()]

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        status_msg = "activated" if user.is_active else "deactivated"
        log_admin_action(request, 'TOGGLE_USER_STATUS', 'User', user.id, {'status': status_msg})
        return Response({'status': f'User {status_msg}', 'is_active': user.is_active})

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get('password')
        if not new_password:
            return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        log_admin_action(request, 'RESET_PASSWORD', 'User', user.id, {'username': user.username})
        return Response({'status': 'Password reset successfully'})

    def perform_destroy(self, instance):
        user_id = instance.id
        user_name = instance.username
        instance.delete()
        log_admin_action(self.request, 'DELETE_USER', 'User', user_id, {'username': user_name})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_users = User.objects.count()
        vendors_count = User.objects.filter(role='VENDOR').count()
        customers_count = User.objects.filter(role='CUSTOMER').count()
        admins_count = User.objects.filter(role='ADMIN').count()

        return Response({
            'total_users': total_users,
            'vendors': vendors_count,
            'customers': customers_count,
            'admins': admins_count
        })
