from rest_framework.routers import DefaultRouter
from .views import RoutineViewset, RoutineEntryViewset

router = DefaultRouter()
router.register(r'routine', RoutineViewset, basename= 'routine')
router.register(r'routineEntry', RoutineEntryViewset, basename= 'routineentry')

urlpatterns = router.urls