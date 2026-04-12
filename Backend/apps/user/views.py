from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .regSerializer import RegisterSerializer, LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
# In your views.py
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request): 
        
        user = User.objects.filter(email = request.data["email"]).exists()
        
        if user:
            return Response({"success": False, "message": "User email is already exists"}, status = status.HTTP_400_BAD_REQUEST)
        
        serializer = RegisterSerializer(data = request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "message": "User created successfully"}, status=status.HTTP_201_CREATED )
        return Response({"success": False, "message": serializer.errors}, status = status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data = request.data)
        
        if serializer.is_valid():
            username_or_email = serializer.validated_data['username_or_email']
            password = serializer.validated_data['password']
            
            user = User.objects.filter(email = username_or_email).first()
            
            if user:
                username = user.username
            else:
                username = username_or_email
                
            user = authenticate(username = username, password = password)
            
            if user:
                
                refresh = RefreshToken.for_user(user)
                access = str(refresh.access_token)
                
                response =  Response({
                    "success": True,
                    "message": "Login Successfully",
                    # "access_token": str(refresh.access_token),
                    # # "refresh_token": str(refresh),
                    "user": user.username,
                    "userId": user.id
                })
                
                response.set_cookie(
                    key = "access_token",
                    value = access,
                    httponly = True,
                    samesite = "Lax",
                    max_age=3600
                    )
                
                response.set_cookie(
                    key="refresh_token",
                    value= str(refresh),
                    httponly=True,
                    samesite="Lax",
                    max_age=7 * 24 * 3600
                    )
                
                return response
            
            return Response({"success": False, "message": "User or email or password not found"})
        
        return Response(
            {"success": False, "message": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
        
        
class LogoutView(APIView):
    def post(self, request):
        response = Response({"success": True, "message": "Logged out"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
        
        
class UserAuthentication(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            "success": True,
            # "userId": request.user.id,
            "user": request.user.username
        })
        
        
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {"success": False, "message": "No refresh token"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)
            new_access = str(refresh.access_token)

            response = Response({"success": True, "message": "Token refreshed"})
            response.set_cookie(
                key="access_token",
                value=new_access,
                httponly=True,
                samesite="Lax",
                max_age=3600
            )
            return response

        except TokenError:
            return Response(
                {"success": False, "message": "Refresh token expired, please login again"},
                status=status.HTTP_401_UNAUTHORIZED
            )
            

        