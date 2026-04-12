from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from .models import NotesModel
from .notesSerializer import NotesSerializer

class NoteViewSet(ModelViewSet):
    serializer_class = NotesSerializer
    
    def get_queryset(self):
        return NotesModel.objects.filter(user = self.request.user).order_by("-updated_at")
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)
    