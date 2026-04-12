from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from django.db import IntegrityError
from .models import Category
from .categorySerializer import CategorySerializer
from rest_framework.exceptions import ValidationError
from rest_framework import status

class CategoryView(ModelViewSet):

    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)

        except ValidationError:
            return Response(
                {"success": False, "message": "Category with this name already exists"},
            status=status.HTTP_400_BAD_REQUEST)
            
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
    
        return Response(
            {"success": True, "message": "Category deleted successfully"},
                status=status.HTTP_200_OK
            )
            
            