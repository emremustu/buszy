import json
from django.db import connection, models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import base64

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    last_login = models.DateTimeField(null=True, blank=True)  # last_login alanını ekleyin
    account_type = models.CharField(max_length=20)
    image=models.BinaryField()


    def __str__(self):
        return f"{self.name} {self.last_name} ({self.email})"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @staticmethod
    def custom_create_user(name, last_name, email, raw_password,account_type):
        hashed_password = make_password(raw_password)
        query = """
            INSERT INTO buszy_app_user (name, last_name, email, password, account_type)
            VALUES (%s, %s, %s, %s, %s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [name, last_name, email, hashed_password,account_type])

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

    @staticmethod
    def getUserinfoById(user_id):
        query = """
        SELECT id, name, last_name, email, password, last_login, account_type, image
        FROM buszy_app_user WHERE id=%s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [user_id])
            row = cursor.fetchone()

            if row:
                # unpack values
                (
                    id,
                    name,
                    last_name,
                    email,
                    password,
                    last_login,
                    account_type,
                    image
                ) = row

                # convert bytes → base64 → string
                image_base64 = (
                    base64.b64encode(image).decode('utf-8')
                    if image else None
                )

                return {
                    "id": user_id,
                    "name": name,
                    "last_name": last_name,
                    "email": email,
                    "password": password,  # frontend'e göndermen önerilmez!
                    "last_login": last_login.isoformat(),
                    "account_type": account_type,
                    "image": image_base64
                }
            else:
                return None


    @staticmethod
    def deleteAccount(user_id):
        query="""
        DELETE FROM comments WHERE user_id = %s;
        DELETE FROM tickets WHERE user_id = %s;
        DELETE FROM buszy_app_user WHERE id=%s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [user_id,user_id,user_id])    


    @staticmethod
    def addProfilePicture(user_id,image_blob):
        query="""
        UPDATE buszy_app_user SET image = %s WHERE id=%s;
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[image_blob,user_id])






class Voyage(models.Model):
    bus_company = models.CharField(max_length=50)
    bus_plate = models.CharField(max_length=10, unique=True,primary_key=True)
    crew = models.CharField(max_length=100)
    cities = models.JSONField()  # JSON veri tipi ile şehirleri saklamak için

    class Meta:
        db_table = 'voyages'  # Veritabanındaki tablo adı
        managed=False

    @staticmethod
    def create_voyage(bus_company, bus_plate, crew, cities):
        # Python dict'leri JSON string'e çevriliyor
        cities_json = json.dumps(cities)

        query = """
            INSERT INTO voyage (bus_company, bus_plate, crew, cities)
            VALUES (%s, %s, %s, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(query, [
                bus_company,
                bus_plate,
                crew,
                cities_json
            ])
           
    @staticmethod
    def update_crew(crew,plate):
        query= """
        UPDATE voyage SET crew = %s WHERE bus_plate = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                crew,
                plate,
            ])


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

    


class VoyageListing(models.Model):
    list_id = models.AutoField(primary_key=True)
    bus_company = models.CharField(max_length=50)
    bus_time = models.TimeField()
    bus_list_begin = models.CharField(max_length=20)
    bus_list_end = models.CharField(max_length=20)
    bus_list_price = models.DecimalField(max_digits=6, decimal_places=2)
    voyage_date = models.DateField()
    bus_plate = models.ForeignKey(Voyage, on_delete=models.CASCADE, related_name='voyage')  # FOREIGN KEY ile ilişki

    def __str__(self):
        return f"{self.bus_company} - {self.bus_time}"
    


    @staticmethod
    def addVoyageListing(bus_company, bus_time, bus_list_begin, bus_list_end, bus_list_price, voyage_date, bus_plate, image_base64):
        try:
            # base64 → bytes dönüşümü (eğer varsa)
            image_blob = base64.b64decode(image_base64) if image_base64 else None

            query = """
                INSERT INTO voyage_listing 
                (bus_company, bus_time, bus_list_begin, bus_list_end, bus_list_price, voyage_date, bus_plate, image) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(query, [
                    bus_company, bus_time, bus_list_begin, bus_list_end,
                    bus_list_price, voyage_date, bus_plate, image_blob
                ])
                # fetchone burada gereksiz, çünkü INSERT işleminden veri dönmez
            return True

        except Exception as e:
            print(f"Error in addVoyageListing: {e}")
            return None 


    @staticmethod
    def getVoyageList(date, origin, destination):
        query = """
        SELECT * FROM voyage_listing WHERE voyage_date=%s AND bus_list_begin=%s AND bus_list_end=%s;
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [date, origin, destination])
            columns = [col[0] for col in cursor.description]
            voyage_data = cursor.fetchall()

        if voyage_data:
            result = []
            for row in voyage_data:
                row_dict = dict(zip(columns, row))

                # image alanını base64'e çevir
                if row_dict.get("image"):
                    row_dict["image"] = base64.b64encode(row_dict["image"]).decode("utf-8")
                else:
                    row_dict["image"] = None

                result.append(row_dict)

            return result
        else:
            return None



    @staticmethod
    def getVoyageListByPlate(plate):
        query = """
        SELECT * FROM voyage_listing WHERE bus_plate=%s;
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [plate])
            voyage_data = cursor.fetchall()

        # Log all the fetched data to check the format
        #print("Fetched voyage data:", voyage_data)

        if voyage_data:
            return voyage_data
        else:
            return None


    


    @staticmethod
    def updateVoyageListing(list_id,bus_list_begin,bus_list_end,bus_time,bus_list_price,voyage_date):
        query="""
        UPDATE voyage_listing SET bus_list_begin = %s, bus_list_end = %s, bus_time=%s, bus_list_price=%s, voyage_date=%s WHERE list_id = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                bus_list_begin,
                bus_list_end,
                bus_time,
                bus_list_price,
                voyage_date,
                list_id,
            ])
        

class Seats(models.Model):
    bus_plate=models.ForeignKey(Voyage,on_delete=models.CASCADE,related_name='voyage_seats')
    start_location = models.CharField(max_length=20)
    end_location = models.CharField(max_length=20)
    seat = models.IntegerField()
    seat_status= models.CharField(max_length=50)
    gender=models.CharField(max_length=10)

    class Meta:
        db_table = 'seats'  # Veritabanındaki tablo adı
        managed=False

    @staticmethod
    def getSeats(bus_plate,start_location,end_location):
        query="""
        SELECT * FROM seats WHERE bus_plate=%s AND start_location =%s AND end_location=%s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                bus_plate,
                start_location,
                end_location
            ])
            data = cursor.fetchall()

        if data:
            return data
        else:
            return None 



    @staticmethod
    def createSeat(bus_plate,start_location,end_location,seat):
        query="""
        INSERT INTO seats (bus_plate, start_location, end_location, seat, seat_status, gender) VALUES (%s, %s, %s, %s, %s, %s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                bus_plate,
                start_location,
                end_location,
                seat,
                "Avaliable",
                "None"
            ])

    @staticmethod
    def updateSeat(bus_plate, start_location, end_location, seat, seat_status, gender):
        query = """
        UPDATE seats 
        SET seat_status = %s, gender = %s 
        WHERE bus_plate = %s AND seat = %s AND start_location = %s AND end_location = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [
                seat_status,
                gender,
                bus_plate,
                seat,
                start_location,
                end_location
            ])



class Tickets(models.Model):
    ticket_id=models.AutoField(primary_key=True)
    user_id=models.IntegerField()
    origin=models.CharField(max_length=20)
    destination=models.CharField(max_length=20)
    voyage_date = models.DateField()
    voyage_time = models.TimeField()
    seat=models.IntegerField()
    list_id = models.ForeignKey(VoyageListing,on_delete=models.CASCADE,related_name='voyage_listing')

    class Meta:
        db_table = 'tickets'
        managed=False 

    @staticmethod
    def createTicket(user_id,origin,destination,voyage_date,voyage_time,seat,company):
        query="""
        INSERT INTO tickets (user_id, origin, destination, voyage_date, voyage_time, seat, company) VALUES (%s,%s,%s,%s,%s,%s,%s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                user_id,
                origin,
                destination,
                voyage_date,
                voyage_time,
                seat,
                company
            ])

    @staticmethod
    def deleteTicket(ticket_id):
        query="""
        DELETE * FROM tickets WHERE ticket_id=%s;
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                ticket_id
            ])


    @staticmethod
    def getTickets(origin,destination,date,company):
        query="""
        SELECT * FROM tickets WHERE origin=%s AND destination=%s AND voyage_date = %s AND company =%s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                origin,
                destination,
                date,
                company
            ])
            data = cursor.fetchall()
            print(data)
            if data:
                return data
            else:
                return None
            

    @staticmethod
    def getTicketsById(user_id):
        query="""
        SELECT * FROM tickets WHERE user_id = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                user_id
            ])
            data = cursor.fetchall()

            if data:
                return data
            else:
                return None       



class Comments(models.Model):
    comment_id=models.AutoField(primary_key=True)
    rate = models.IntegerField()
    user_id=models.IntegerField()
    user_comment=models.CharField(max_length=255)
    ticket_id = models.IntegerField()

    class Meta:
        db_table = 'comments'  # Veritabanındaki tablo adı
        managed=False


    @staticmethod
    def addComment(rate,user_id,user_comment,ticket_id):
        query="""
        INSERT INTO comments (rate, user_id, user_comment, ticket_id) VALUES (%s,%s,%s,%s)
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                rate,
                user_id,
                user_comment,
                ticket_id
            ])
        
    @staticmethod
    def seeComment(ticket_id):
        query="""
        SELECT * FROM comments WHERE ticket_id = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query,[
                ticket_id
            ])
            data=cursor.fetchall()

            if data:
                return data
            else:
                return None
            

    @staticmethod
    def seeComments(company):
        query = """
        SELECT 
            ticket_id, 
            comment_id,
            rate,
            user_id, 
            user_comment, 
            origin, 
            destination, 
            voyage_date, 
            voyage_time, 
            seat, 
            company
        FROM comments 
        JOIN tickets USING (ticket_id)
        WHERE company = %s
        """
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute(query, [company])
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()

        if rows:
            result = [dict(zip(columns, row)) for row in rows]
            return result
        else:
            return None
          
            