from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('get-voyage',views.get_voyage,name='get_voyage'),
    path('add-voyage',views.add_voyage,name='add_voyage'),
    path('get-voyage-list',views.get_voyages,name='get_voyages'),
]
