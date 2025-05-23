import base64
from datetime import datetime
from decimal import Decimal
from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django.http import JsonResponse
from .models import Comments, Seats, Tickets, User, Voyage, VoyageListing
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone
import requests
from django.db import transaction

def get_distance_km(origin, destination, api_key):
    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?origins={origin}&destinations={destination}&key={api_key}&language=tr"
    response = requests.get(url)
    data = response.json()

    # API genel durumu
    if data.get("status") != "OK":
        raise Exception(f"Google API error: {data.get('status')}")

    try:
        element = data["rows"][0]["elements"][0]
        element_status = element["status"]

        if element_status != "OK":
            raise Exception(f"Distance API element error: {element_status}")

        meters = element["distance"]["value"]
        km = Decimal(meters) / Decimal('1000')
        return km.quantize(Decimal('0.01'))

    except Exception as e:
        raise Exception(f"Failed to get distance: {str(e)}")





@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            account_type = data.get('account_type')

            if account_type == "individuals":
                if not name or not last_name or not email or not password:
                    return JsonResponse({"success": False, "message": "Eksik alan var!"})
            else:
                if not name or not email or not password:
                    last_name=""
                    return JsonResponse({"success": False, "message": "Eksik alan var!"})
            

            # Yeni kullanıcı oluştur
            user = User(name=name, last_name=last_name, email=email,account_type=account_type)
            user.set_password(password)
            user.save()

            return JsonResponse({"success": True, "message": "Kullanıcı başarıyla kaydedildi!"})

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "message": "Geçersiz JSON verisi!"})
        
        except IntegrityError:
            # Eğer e-posta adresi zaten varsa
            return JsonResponse({"success": False, "message": "Bu e-posta ile zaten bir kullanıcı var!"})

    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})




@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data.get('email')
        password = data.get('password')
        

        email = email.strip().lower()

        if User.custom_check_user_password(email, password):
            try:
                user = User.objects.get(email=email)
                user.last_login = timezone.now()
                user.save()

                # image'ı base64'e çevir    
                encoded_image = None
                if user.image:
                    encoded_image = base64.b64encode(user.image).decode('utf-8')

                return JsonResponse({
                        "success": True,
                        "message": "Giriş başarılı!",
                        "user_id": user.id,
                        "user_mail": user.email,
                        "user_name": user.name,
                        "account_type": user.account_type,
                        "image": encoded_image  # <-- artık JSON ile uyumlu
                        })
            except User.DoesNotExist:
                return JsonResponse({"success": False, "message": "Kullanıcı bulunamadı!"})
        else:
            return JsonResponse({"success": False, "message": "Geçersiz e-posta veya şifre!"})

    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})


@csrf_exempt
def get_voyage(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        bus_plate = data.get('bus_plate')

        if not bus_plate:
            return JsonResponse({"success": False, "message": "Please provide a bus_plate."})

        voyage = Voyage.select_voyagebyplate(bus_plate)
        if voyage:
            return JsonResponse({"success": True, "voyage": voyage})
        else:
            return JsonResponse({"success": False, "message": "No voyage found for the given bus_plate."})

    return JsonResponse({"success": False, "message": "Invalid request method."})

@csrf_exempt
def get_voyage_listing(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        date = data.get('date')
        origin = data.get('origin')
        destination = data.get('destination')

        try:
            data=VoyageListing.getVoyageList(date,origin,destination)

            return JsonResponse({"success":True,"voyages":data})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})

@csrf_exempt
def deleteTicket(request):
    if request.method=='POST':
        data=json.loads(request.body)
        ticket_id=data.get('ticket_id')

        try:
            data=Tickets.getTicketsByTicketId(ticket_id)
            ticket = data[0]  # Extract the first (and assumed only) result
            origin = ticket['origin']
            destination = ticket['destination']  # Note: your original code had a typo here: 'destiantion'
            company = ticket['company']
            date = ticket['voyage_date']
            time = ticket['voyage_time']
            seat = ticket['seat']



            voyage_listing_data = VoyageListing.getVoyageListByOriginDestinationCompany(origin,destination,company)

            print("Voyage Listing Data:", voyage_listing_data)  # Debug print

            timeOfEnd_location = None
            dateOfEnd_location = None


            for a in voyage_listing_data:
                if a[3] == destination:
                    timeOfEnd_location = a[2]
                    dateOfEnd_location = a[6]
                    break

            # If no time or date was found for the end location
            if not timeOfEnd_location or not dateOfEnd_location:
                for a in voyage_listing_data:
                                Seats.updateSeat(a[7], a[3], a[4], seat, "Avaliable", None)

                
                Tickets.deleteTicket(ticket_id)
                return JsonResponse({"success":True,"message":"Successfully Deleted"})                  
            else:
                print(f"Time for end location: {timeOfEnd_location}, Date for end location: {dateOfEnd_location}")  # Debug print

                # Convert the given date and time to datetime objects
                datetime1 = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
                datetime2 = datetime.strptime(f"{dateOfEnd_location} {timeOfEnd_location}", "%Y-%m-%d %H:%M:%S")

                # Process each seat number and gender from the seat_numbers list
                for a in voyage_listing_data:
                    dateofVoyage = datetime.strptime(f"{a[6]} {a[2]}", "%Y-%m-%d %H:%M:%S")
                    if datetime1 <= dateofVoyage < datetime2:
                                Seats.updateSeat(a[7], a[3], a[4], seat, "Avaliable", None)



                Tickets.deleteTicket(ticket_id)
                # Return a success response
                return JsonResponse({"success":True,"message":"Successfully Deleted"})
            





            
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})

@csrf_exempt
def get_voyage_listing_byPlate(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        plate=data.get('plate')

        try:    
            voyagelisting_data = VoyageListing.getVoyageListByPlate(plate)
            print(voyagelisting_data)
            return JsonResponse({"success":True,"voyage_list":voyagelisting_data})
        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error:{str(e)}"})



@csrf_exempt
def update_crew(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        plate=data.get('plate')
        crew=data.get('crew')

        try:
            Voyage.update_crew(crew,plate)

            return JsonResponse({"success":True,"message":"Successfully Updated"})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})        

@csrf_exempt
def update_voyage_listing(request):
    if request.method=='POST':
        data = json.loads(request.body)
        list_id=data.get('list_id')
        bus_list_begin=data.get('bus_list_begin')
        bus_list_end=data.get('bus_list_end')
        bus_time=data.get('bus_time')
        price=data.get('price')
        date=data.get('date')

        try:
            VoyageListing.updateVoyageListing(list_id,bus_list_begin,bus_list_end,bus_time,price,date)

            return JsonResponse({"success":True,"message":"Successfully Updated"})
        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})        

                


@csrf_exempt
def add_voyage(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        bus_company = data.get('bus_company')
        bus_plate = data.get('bus_plate')
        crew = data.get('crew')
        cities = data.get('cities')
        image=data.get('image')

        if not bus_company or not bus_plate or not crew or not cities:
            return JsonResponse({"success": False, "message": "There are missing fields!"})
        elif len(cities) == 1:
            return JsonResponse({"success": False, "message": "There must be more than one cities in a voyage!"})

        try:
            with transaction.atomic():
                # Burada json.dumps kullanmıyoruz çünkü modelin içindeki fonksiyon zaten JSON'a çeviriyor
                Voyage.create_voyage(bus_company, bus_plate, crew, cities)
                # Eğer şehirleri yazdırmak istiyorsan cities üzerinde dön
            
                for i in range(len(cities)):
                    city_i = cities[i]
                
                    for j in range(i+1,len(cities)):
                    
                        city_j = cities[j]
                    


                            
                        distance_km= get_distance_km(city_i['city'],city_j['city'],"AIzaSyBqgUsbGweMs6ucid-Y1BnHVM-fbxWcXEU")
                        print(distance_km)
                        if distance_km is None:
                            return JsonResponse({"success": False, "message": f"Could not get distance from {city_i['city']} to {city_j['city']}"})
                        price_per_km = Decimal('1.4') 
                        price = (distance_km * price_per_km).quantize(Decimal('0.01'))

                        VoyageListing.addVoyageListing(bus_company,city_i['time'],city_i['city'],city_j['city'],price,city_i['date'], bus_plate,image)
                        for i in range(1,42):
                            Seats.createSeat(bus_plate,city_i['city'],city_j['city'],i)

                
                    
                    

                return JsonResponse({"success": True, "message": "Successfully added!"})

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})



@csrf_exempt
def getSeats(request):
    if request.method=='POST':
        data=json.loads(request.body)
        bus_plate=data.get('plate')
        start_location=data.get('start_location')
        end_location=data.get('end_location')

        try:
            data= Seats.getSeats(bus_plate,start_location,end_location)
            return JsonResponse({"success":True, "seats":data})
        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})
            



@csrf_exempt
def setSeats(request):
    if request.method == 'POST':
        print(request.body)
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)

            # Extract the required fields from the request data
            user_id = data.get("user_id")
            list_id = data.get("list_id")
            plate = data.get("plate")
            start_location = data.get('start_location')
            end_location = data.get('end_location')
            seat_numbers = data.get("seat_numbers", [])  # Expecting a list of seat objects
            time = data.get("time")
            date = data.get("date")

            # Ensure that time and date are provided
            if not time or not date:
                raise ValueError("Time or Date information is missing!")

            # Fetch the voyage listing data for the given plate
            voyage_listing_data = VoyageListing.getVoyageListByPlate(plate)

            print("Voyage Listing Data:", voyage_listing_data)  # Debug print

            timeOfEnd_location = None
            dateOfEnd_location = None


            for a in voyage_listing_data:
                if a[3] == end_location:
                    timeOfEnd_location = a[2]
                    dateOfEnd_location = a[6]
                    break

            # If no time or date was found for the end location
            if not timeOfEnd_location or not dateOfEnd_location:
                for a in voyage_listing_data:
                    for seat in seat_numbers:
                            seat_no = seat.get("seat")
                            gender = seat.get("gender")
                            if seat_no and gender:
                                print(f"Koltuk No: {seat_no}, Cinsiyet: {gender}")
                                Seats.updateSeat(plate, a[3], a[4], seat_no, "Occupied", gender)
                
                for seat in seat_numbers:
                    seat_no=seat.get("seat")
                    company=voyage_listing_data[0][1]
                    Tickets.createTicket(user_id,start_location,end_location,date,time,seat_no,company)

                
                return JsonResponse({"status": "success"})                  
            else:
                print(f"Time for end location: {timeOfEnd_location}, Date for end location: {dateOfEnd_location}")  # Debug print

                # Convert the given date and time to datetime objects
                datetime1 = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
                datetime2 = datetime.strptime(f"{dateOfEnd_location} {timeOfEnd_location}", "%Y-%m-%d %H:%M:%S")

                # Process each seat number and gender from the seat_numbers list
                for a in voyage_listing_data:
                    dateofVoyage = datetime.strptime(f"{a[6]} {a[2]}", "%Y-%m-%d %H:%M:%S")
                    if datetime1 <= dateofVoyage < datetime2:
                        for seat in seat_numbers:
                            seat_no = seat.get("seat")
                            gender = seat.get("gender")
                            if seat_no and gender:
                                print(f"Koltuk No: {seat_no}, Cinsiyet: {gender}")
                                Seats.updateSeat(plate, a[3], a[4], seat_no, "Occupied", gender)
                for seat in seat_numbers:
                    seat_no=seat.get("seat")
                    company=voyage_listing_data[0][1]
                    Tickets.createTicket(user_id,start_location,end_location,date,time,seat_no,company)
                # Return a success response
                return JsonResponse({"status": "success"})

        except ValueError as ve:
            # Return an error response if there is a missing value
            return JsonResponse({"status": "error", "message": str(ve)}, status=400)
        except Exception as e:
            # Return an error response for other exceptions
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    else:
        # Return an error if the request method is not POST
        return JsonResponse({"status": "invalid request"}, status=405)

@csrf_exempt
def getTickets(request):
    if request.method=='POST':
        try:
            data= json.loads(request.body)
            origin=data.get('origin')
            destination=data.get('destination')
            date=data.get('date')
            company=data.get('company')

            result=Tickets.getTickets(origin,destination,date,company)

            print(result)
            return JsonResponse({"status": "success","tickets":result})
        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})    
        


@csrf_exempt
def getTicketsByUserId(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            userId= data.get('userId')
            
            result = Tickets.getTicketsById(userId)
            return JsonResponse({"status": "success","tickets":result})

        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})    

@csrf_exempt
def addComment(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            user_id= data.get('user_id')
            rate= data.get('rate')
            user_comment=data.get('user_comment')
            ticket_id=data.get('ticket_id')

            result=Comments.addComment(rate,user_id,user_comment,ticket_id)

            

            return JsonResponse({"status": "success","comment":result})

        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})    



@csrf_exempt
def seeComment(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            ticket_id = data.get('ticket_id')

            result = Comments.seeComment(ticket_id)

            return JsonResponse({"status": "success","comment":result})


        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})   




@csrf_exempt
def seeComments(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            company = data.get('company')

            result = Comments.seeComments(company)

            return JsonResponse({"success":True,"comment":result})


        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})          


@csrf_exempt
def getUserData(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            user_id = data.get('user_id')

            result = User.getUserinfoById(user_id)

            return JsonResponse({"status": "success","user_info":result})


        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})
        


@csrf_exempt
def deleteAccount(request):
    if request.method=='POST':
        try:
            data=json.loads(request.body)
            user_id = data.get('user_id')

            result = User.deleteAccount(user_id)

            return JsonResponse({"success":True})

        except Exception as e:
            return JsonResponse({"success":False,"message":f"Error: {str(e)}"})        
        

@csrf_exempt
def addOrUptadeImage(request):
    if request.method == 'POST':
        try:
            user_id = request.POST.get('user_id')
            image_file = request.FILES.get('image')

            if not user_id or not image_file:
                return JsonResponse({"success": False, "message": "Missing user_id or image"})

            # read binary data
            image_blob = image_file.read()

            User.addProfilePicture(user_id, image_blob)
            return JsonResponse({"success": True, "message": "Image updated"})

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})