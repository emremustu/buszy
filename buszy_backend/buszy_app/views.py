from decimal import Decimal
from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django.http import JsonResponse
from .models import User, Voyage, VoyageListing
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone
import requests


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

            if not name or not last_name or not email or not password:
                return JsonResponse({"success": False, "message": "Eksik alan var!"})

            # Yeni kullanıcı oluştur
            user = User(name=name, last_name=last_name, email=email)
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
                # Giriş yaptıktan sonra last_login'ı güncelle
                user.last_login = timezone.now()
                user.save()  # Veritabanında güncelleme yapıyoruz
                from django.contrib.auth import login as auth_login
                auth_login(request, user)
                return JsonResponse({"success": True, "message": "Giriş başarılı!"})
            except User.DoesNotExist:
                return JsonResponse({"success": False, "message": "Kullanıcı bulunamadı!"})
        else:
            return JsonResponse({"success": False, "message": "Geçersiz e-posta veya şifre!"})

    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})


@csrf_exempt
def get_voyage(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        bus_id = data.get('bus_id')
        bus_plate = data.get('bus_plate')

        # Eğer ikisi de None ise hata döndür
        if bus_id is None and bus_plate is None:
            return JsonResponse({"success": False, "message": "bus_id ve bus_plate değerlerinden en az birini girin!"})

        # Eğer bus_id verilmişse, bus_id ile sorgu yap
        elif bus_id is not None:
            try:
                bus_id_int = int(bus_id)  # Bus ID'yi int türüne dönüştür
                voyage = Voyage.select_voyage(bus_id_int)
                if voyage:
                    return JsonResponse({"success": True, "voyage": voyage})
                else:
                    return JsonResponse({"success": False, "message": "Bu bus_id ile ilgili bir sefer bulunamadı."})
            except ValueError:
                return JsonResponse({"success": False, "message": "Geçersiz bus_id değeri."})

        # Eğer bus_plate verilmişse, bus_plate ile sorgu yap
        elif bus_plate is not None:
            voyage = Voyage.select_voyagebyplate(bus_plate)
            if voyage:
                return JsonResponse({"success": True, "voyage": voyage})
            else:
                return JsonResponse({"success": False, "message": "Bu bus_plate ile ilgili bir sefer bulunamadı."})

    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})



@csrf_exempt
def add_voyage(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        bus_company = data.get('bus_company')
        bus_plate = data.get('bus_plate')
        seats_emp = data.get('seats_emp')
        seats_full = data.get('seats_full')
        crew = data.get('crew')
        cities = data.get('cities')

        if not bus_company or not bus_plate or not crew or not cities:
            return JsonResponse({"success": False, "message": "There are missing fields!"})
        elif len(cities) == 1:
            return JsonResponse({"success": False, "message": "There must be more than one cities in a voyage!"})

        try:
            # Burada json.dumps kullanmıyoruz çünkü modelin içindeki fonksiyon zaten JSON'a çeviriyor
            Voyage.create_voyage(bus_company, bus_plate, seats_emp, seats_full, crew, cities)
            # Eğer şehirleri yazdırmak istiyorsan cities üzerinde dön
            
            for i in range(len(cities)):
                city_i = cities[i]
                
                for j in range(i+1,len(cities)):
                    
                    city_j = cities[j]
                    try:


                            
                        distance_km= get_distance_km(city_i['city'],city_j['city'],"AIzaSyBqgUsbGweMs6ucid-Y1BnHVM-fbxWcXEU")
                        print(distance_km)
                        if distance_km is None:
                            return JsonResponse({"success": False, "message": f"Could not get distance from {city_i['city']} to {city_j['city']}"})

                        price_per_km = Decimal('1.4') 
                        price = (distance_km * price_per_km).quantize(Decimal('0.01'))

                        VoyageListing.addVoyageListing(bus_company,city_i['time'],city_i['city'],city_j['city'],price,bus_plate)
                    except Exception as e:
                        return JsonResponse({"success":False,"message": f"Error: {str(e)}"})
                    

            return JsonResponse({"success": True, "message": "Successfully added!"})

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error: {str(e)}"})



        