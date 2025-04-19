from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django.http import JsonResponse
from .models import User, Voyage
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from django.utils import timezone

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
            voyage = Voyage.select_voyage(bus_id)
            if voyage:
                return JsonResponse({"success": True, "voyage": voyage})
            else:
                return JsonResponse({"success": False, "message": "Bu bus_id ile ilgili bir sefer bulunamadı."})

        # Eğer bus_plate verilmişse, bus_plate ile sorgu yap
        elif bus_plate is not None:
            voyage = Voyage.objects.filter(bus_plate=bus_plate).first()
            if voyage:
                return JsonResponse({"success": True, "voyage": voyage})
            else:
                return JsonResponse({"success": False, "message": "Bu bus_plate ile ilgili bir sefer bulunamadı."})
    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})
