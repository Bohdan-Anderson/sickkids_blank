from django.conf.urls import patterns, include, url
# from manager.views import *

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', 'layout.views.get', name='home'),
    url(r'^(?P<get>.*)/$','layout.views.get',name="rawpost"),
    # url(r'^(?P<get>.*)/.','layout.views.get',name="rawpost"),    
    
    # Examples:
    # url(r'^$', 'sickkids_ortho.views.home', name='home'),
    # url(r'^sickkids_ortho/', include('sickkids_ortho.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    
    # url(r'^$','layout.views.post',name="rawpost"),

    # # Uncomment the next line to enable the admin:
    # url(r'^sitemap/', 'layout.views.siteMap',name="siteMap"),
    # url(r'^admin/', include(admin.site.urls)),
    # url(r'^list/$','layout.views.list',name="layoutlist"),
    # url(r'^ajax/(?P<post>.*)/$','layout.views.ajaxpost',name="ajaxpost"),
    # url(r'^map/$','layout.views.map',name="map"),
    # url(r'^circle/$','layout.views.circle',name="map"),
    # url(r'^treemap/$','layout.views.treemap',name="treemap"),
    # url(r'^downloads/(?P<filename>.*)', 'layout.views.pdf_download'),

    # url(r'^robots.txt', 'layout.views.robots', name='forbots'),
    #url(r'^$', 'layout.views.post', name='home'),
)


from django.conf import settings

if settings.DEBUG:
    urlpatterns += patterns('',
        url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
            'document_root': settings.MEDIA_ROOT,
        }),
   )