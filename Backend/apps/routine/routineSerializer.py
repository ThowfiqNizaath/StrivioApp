from rest_framework.serializers import ModelSerializer
from .models import Routine, RoutineEntry

class RoutineSerializer(ModelSerializer):
    class Meta:
        model = Routine
        fields = '__all__'
        

class RoutineEntrySerializer(ModelSerializer):
    class Meta:
        model = RoutineEntry
        fields = '__all__'