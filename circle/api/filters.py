import django_filters
from core.models import Post, User


class PostFilter(django_filters.FilterSet):
    username = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    class Meta:
        model = Post
        fields = {
            'post' : ['icontains' ]
        }

class UserFilter(django_filters.FilterSet):
    class Meta:
        model = User
        fields ={
            'username': ['icontains']
        }