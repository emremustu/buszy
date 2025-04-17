from django.contrib.auth import authenticate, login
from django.db import IntegrityError
from django.http import JsonResponse
from .models import User
import json
from django.views.decorators.csrf import csrf_exempt

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

        # E-posta ile doğrulama işlemi
        user = authenticate(request, email=email, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({"success": True, "message": "Giriş başarılı!"})
        else:
            return JsonResponse({"success": False, "message": "Geçersiz e-posta veya şifre!"})

    return JsonResponse({"success": False, "message": "Geçersiz istek türü!"})
