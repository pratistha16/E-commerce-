from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
from core.permissions import IsCustomer
import uuid

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.role == 'VENDOR':
            return Payment.objects.filter(order__vendor__user=self.request.user)
        return Payment.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsCustomer])
    @transaction.atomic
    def process_payment(self, request):
        order_ids = request.data.get('order_ids', [])
        method = request.data.get('method', 'STRIPE')
        
        if not order_ids:
            return Response({'error': 'No orders provided'}, status=status.HTTP_400_BAD_REQUEST)

        orders = Order.objects.filter(id__in=order_ids, user=request.user)
        if not orders.exists():
            return Response({'error': 'Orders not found'}, status=status.HTTP_404_NOT_FOUND)

        payments = []
        for order in orders:
            # Mocking payment processing logic
            # In a real scenario, you'd call Stripe/PayPal API here
            
            # 1. Create Payment record
            payment = Payment.objects.create(
                order=order,
                user=request.user,
                amount=order.total_amount,
                method=method,
                status='COMPLETED', # Mocking success
                transaction_id=f"PAY-{uuid.uuid4().hex[:12].upper()}"
            )
            
            # 2. Update Order status
            order.payment_status = 'PAID'
            order.status = 'PROCESSING'
            order.save()
            
            payments.append(payment)

        return Response(PaymentSerializer(payments, many=True).data, status=status.HTTP_201_CREATED)
