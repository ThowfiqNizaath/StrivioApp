from django.db import models
from ..category.models import Category

# Create your models here.
class Routine(models.Model):
    category = models.ForeignKey(Category, related_name= 'categories', on_delete= models.CASCADE)
    name = models.CharField(max_length= 100)
    created_at = models.DateTimeField(auto_now_add= True)
    active = models.BooleanField(default= True)
    scheduled_at = models.TimeField(default= "00:00")
    
    class Meta:
        unique_together = ['category', 'name']
    
    def __str__(self):
        return self.name
    
    
class RoutineEntry(models.Model):
    routine = models.ForeignKey(Routine, related_name= 'routineentries', on_delete= models.CASCADE)
    date = models.DateField()
    completed = models.BooleanField(default= False)
    note = models.TextField(blank= True)
    created_at = models.DateTimeField(auto_now_add= True)
    
    
    class Meta:
        unique_together = ['routine', 'date']
        
    def __str__(self):
        return f"${self.routine.name} ${self.date}"
    