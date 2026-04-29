from django.urls import path
from .views import CategoryListView, ProductListView, ProductDetailView, ReviewCreateView, ProductRecommendationsView, SimilarProductsView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/recommendations/', ProductRecommendationsView.as_view(), name='product_recommendations'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/<slug:slug>/similar/', SimilarProductsView.as_view(), name='similar_products'),
    path('products/<slug:slug>/reviews/', ReviewCreateView.as_view(), name='review_create'),
]
