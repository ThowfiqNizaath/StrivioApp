from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Category(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE)
    name = models.CharField(max_length= 100)
    created_at = models.DateTimeField(auto_now_add= True)
    active = models.BooleanField(default= True)
    
    
    def __str__(self):
        return self.name
    
    class Meta:
        unique_together = ['user', 'name']