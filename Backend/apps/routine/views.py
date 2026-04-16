from rest_framework.viewsets import ModelViewSet
from .routineSerializer import RoutineSerializer, RoutineEntrySerializer
from .models import Routine, RoutineEntry
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404


class RoutineViewset(ModelViewSet):
    
    serializer_class = RoutineSerializer
    
    def get_queryset(self):
        return Routine.objects.filter(category__user = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save()
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
    
        return Response(
            {"success": True, "message": "Routine deleted successfully"},
                status=status.HTTP_200_OK
            )
    
class RoutineEntryViewset(ModelViewSet):
    
    serializer_class = RoutineEntrySerializer
    
    def get_queryset(self):
        queryset = RoutineEntry.objects.filter(routine__category__user = self.request.user, routine__active = True)
        fromDate = self.request.query_params.get("fromDate")
        toDate = self.request.query_params.get("toDate")
        
        if fromDate and toDate:
            queryset = queryset.filter(date__range = [fromDate, toDate])
        
        elif fromDate:
            queryset = queryset.filter(date = fromDate)
            
        return queryset
    
    def perform_create(self, serializer):
        routine = serializer.validated_data['routine']
        if routine.category.user != self.request.user:
            raise PermissionDenied("Invalid Routine")
        serializer.save()
        

class RoutineEntryByRoutineIdView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def get(self, request, routine_id):
        
        routine = get_object_or_404(Routine, id = routine_id, category__user = request.user)
        
        qureyset = RoutineEntry.objects.filter(routine = routine)
        
        fromDate = request.query_params.get("fromDate")
        toDate = request.query_params.get("toDate")
        
        if fromDate and toDate:
            qureyset = qureyset.filter(date__range = [fromDate, toDate])
        
        elif fromDate:
            qureyset = qureyset.filter(date = fromDate)
            
            
        serializer = RoutineEntrySerializer(qureyset, many = True)
        
        return Response(serializer.data)