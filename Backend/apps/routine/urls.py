from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import RoutineViewset, RoutineEntryViewset, RoutineEntryByRoutineIdView

router = DefaultRouter()
router.register(r'routine', RoutineViewset, basename= 'routine')
router.register(r'routineEntry', RoutineEntryViewset, basename= 'routineentry')

urlpatterns = [
    path("routineEntry/by-routine/<int:routine_id>/",
         RoutineEntryByRoutineIdView.as_view(),
         name = "routine-entry-by-routine-id")
]

urlpatterns += router.urls