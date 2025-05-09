from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('get-voyage',views.get_voyage,name='get_voyage'),
    path('add-voyage',views.add_voyage,name='add_voyage'),
    path('get-voyage-list',views.get_voyage_listing,name='get_voyage_listing'),
    path('get_voyage_listing_by_plate',views.get_voyage_listing_byPlate,name="getvoyagelistbyplate"),
    path('update-crew',views.update_crew,name= 'update-crew'),
    path('update-voyage-list',views.update_voyage_listing,name='update_voyage_listing'),
    path('set-seats',views.setSeats ,name='setSeats'),
    path('get-seats',views.getSeats,name='get-seats'),
    path('get-tickets',views.getTickets,name='get-tickets'),
    path('get-tickets-by-user-id',views.getTicketsByUserId,name='get-tickets-by-user-id'),
    path('add-comment',views.addComment,name='add-comment'),
    path('see-comment',views.seeComment,name='see-comment'),
    path('get-comments',views.seeComments,name='get-comments'),

    path('get-user-data',views.getUserData,name='get-user-data'),
    path('delete-account',views.deleteAccount,name='delete-account')


]
