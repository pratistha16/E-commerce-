from django.urls import path
from .views import CategoryListView, ProductListView, ProductDetailView, ReviewCreateView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('products/<slug:slug>/reviews/', ReviewCreateView.as_view(), name='review_create'),
]
