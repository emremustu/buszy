from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} {self.last_name} ({self.email})"

    def set_password(self, raw_password):
        # Şifreyi güvenli bir şekilde hashleyerek kaydediyoruz
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        # Şifreyi doğrulamak için kullanılan fonksiyon
        return check_password(raw_password, self.password)

    @staticmethod
    def custom_create_user(name, last_name, email, raw_password):
        # Şifreyi hashle
        hashed_password = make_password(raw_password)
        # Raw SQL sorgusu ile kullanıcıyı oluştur
        query = """
            INSERT INTO buszy_app_user (name, last_name, email, password)
            VALUES (%s, %s, %s, %s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [name, last_name, email, hashed_password])

    @staticmethod
    def custom_check_user_password(email, raw_password):
        # Raw SQL sorgusu ile kullanıcıyı bul
        query = """
            SELECT * FROM buszy_app_user WHERE email = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [email])
            user_data = cursor.fetchone()

            if user_data:
                user = User(id=user_data[0], name=user_data[1], last_name=user_data[2], email=user_data[3], password=user_data[4])
                # Şifreyi doğrula
                return user.check_password(raw_password)
            else:
                return False
