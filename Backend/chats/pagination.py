from rest_framework.pagination import CursorPagination
from rest_framework.response import Response

class MessageCursorPagination(CursorPagination):
    page_size = 5
    ordering = "-timestamp"  # Order by timestamp descending, then by pk descending to ensure uniqueness

    def get_paginated_response(self, data):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': list(data)[::-1], # Reverse the results to have oldest messages first
        })
    