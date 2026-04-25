from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count
from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, ReviewSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductListSerializer
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filterset_fields = ('category', 'vendor', 'brand', 'price')
    search_fields = ('name', 'description')
    ordering_fields = ('price', 'created_at')

    @action(detail=True, methods=['get'])
    def similar_products(self, request, slug=None):
        product = Product.objects.get(slug=slug)
        # Simple recommendation logic: Same category, excluding self, limited to 4
        similar = Product.objects.filter(
            category=product.category, 
            is_available=True
        ).exclude(id=product.id)[:4]
        return Response(ProductListSerializer(similar, many=True).data)

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        # Recommend most reviewed products as "Trending"
        trending = Product.objects.filter(is_available=True).annotate(
            review_count=Count('reviews')
        ).order_by('-review_count')[:8]
        return Response(ProductListSerializer(trending, many=True).data)

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductDetailSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        product_slug = self.kwargs.get('slug')
        product = Product.objects.get(slug=product_slug)
        serializer.save(user=self.request.user, product=product)
