from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    last_login = models.DateTimeField(null=True, blank=True)  # last_login alanını ekleyin

    def __str__(self):
        return f"{self.name} {self.last_name} ({self.email})"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @staticmethod
    def custom_create_user(name, last_name, email, raw_password):
        hashed_password = make_password(raw_password)
        query = """
            INSERT INTO buszy_app_user (name, last_name, email, password)
            VALUES (%s, %s, %s, %s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [name, last_name, email, hashed_password])

    @staticmethod
    def custom_check_user_password(email, raw_password):
        query = """
            SELECT * FROM buszy_app_user WHERE email = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [email])
            user_data = cursor.fetchone()

            if user_data:
                user = User(id=user_data[0], name=user_data[1], last_name=user_data[2], email=user_data[3], password=user_data[4])
                return user.check_password(raw_password)
            else:
                return False




class Voyage(models.Model):
    bus_id = models.AutoField(primary_key=True)
    bus_company = models.CharField(max_length=50)
    bus_plate = models.CharField(max_length=10)
    seats_emp = models.JSONField()
    seats_full = models.JSONField()
    crew = models.CharField(max_length=100)
    cities = models.JSONField()  # JSON veri tipi ile şehirleri saklamak için


    @staticmethod
    def create_voyage(bus_company,bus_plate,crew,cities):
        query="""
                INSERT INTO voyage (bus_company, bus_plate, seats_emp,seats_full,crew,cities)
                VALUES (%s,%s,%s,%s,%s,%s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[bus_company,bus_plate,crew,cities])


        queryForListing="""
            INSERT INTO voyage_listing (bus_company, bus_time)
        """    
        
            

           

    @staticmethod
    def select_voyage(bus_id):
        query= """
            SELECT * FROM voyage WHERE bus_id = %d
        """        
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[bus_id])
            voyage_data = cursor.fetchone()

        if voyage_data:
            return voyage_data
        else:
            return None        


    @staticmethod
    def select_voyagebyplate(bus_plate):
        query= """
            SELECT * FROM voyage WHERE bus_plate = %s
        """        
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[bus_plate])
            voyage_data = cursor.fetchone()

        if voyage_data:
            return voyage_data
        else:
            return None 

    def __str__(self):
        return f"{self.bus_company} ({self.bus_plate})"

    class Meta:
        db_table = 'voyage'  # Veritabanındaki tablo adı  



class VoyageListing(models.Model):
    list_id = models.AutoField(primary_key=True)
    bus_company = models.CharField(max_length=50)
    bus_time = models.TimeField()
    bus_list_begin = models.CharField(max_length=20)
    bus_list_end = models.CharField(max_length=20)
    bus_list_price = models.DecimalField(max_digits=4, decimal_places=2)
    bus_id = models.ForeignKey(Voyage, on_delete=models.CASCADE, related_name='voyage')  # FOREIGN KEY ile ilişki

    def __str__(self):
        return f"{self.bus_company} - {self.bus_time}"

    class Meta:
        db_table = 'voyage_listing'  # Veritabanındaki tablo adı



    #VOYAGES TABLE
    #bus_id
    #firma
    #destinations
    #bus_plaka
    #uygun_koltuklar
    #dolu_koltuklar
    #crew_driver


    #VOYAGES LISTING
    #voyages_listing_id
    #firma
    #saat
    #where
    #towhere
    #price
    #bus_id (foreign key)

