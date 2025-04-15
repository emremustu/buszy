from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} {self.last_name} ({self.email})"
    
    def set_password(self, raw_password):
        # Şifreyi güvenli bir şekilde şifreleyerek kaydediyoruz
        from django.contrib.auth.hashers import make_password
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        # Şifreyi doğrulamak için kullanılan fonksiyon
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password)
