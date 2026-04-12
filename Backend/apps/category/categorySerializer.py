from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']
        
    def validate(self, data):
        user = self.context["request"].user
        name = data.get("name")

        if Category.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError(
                "Category with this name already exists"
            )

        return data