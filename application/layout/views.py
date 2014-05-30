from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404, render
from layout.models import *
from itertools import chain
from django.core.urlresolvers import reverse
from django.core.servers.basehttp import FileWrapper
from easy_thumbnails.files import get_thumbnailer
from django.conf import settings

import os
from django.http import Http404  



def static(request):
	get(request,"home")

def getAllPages(pages,get):

	out = []
	current = None
	for page in pages:
		if(get == None):
			get = 1
			current = page
		if(page.slug == get):
			current = page
		outP = {
			"title":page.title,
			"slug":page.slug,
			}
		out.append(outP)
	return out,current

def getTextElements(textObject,cC,request):
	textOut = []
	for text in textObject:
		if( request.is_phone is text.show_on_mobile and text.show_on_mobile or request.is_tablet is text.show_on_tablet and text.show_on_tablet or request.is_mobile is not text.show_on_desktop and text.show_on_desktop):
			out = text.__dict__
			out["coloum_start"] = (text.coloum_from+0.0)/cC*100
			out["coloum_width"] = (text.coloum_to - text.coloum_from+0.0)/cC*100
			out["type"] = text
			textOut.append(out)
	return textOut

def getImageSize(request):
	out = "desktop"
	if(request.is_tablet):
		out = "tablet"
	if(request.is_phone):
		out = "phone"
	return out

def shouldweshow(request,element):
	if( request.is_phone is element.show_on_mobile and element.show_on_mobile or request.is_tablet is element.show_on_tablet and element.show_on_tablet or request.is_mobile is not element.show_on_desktop and element.show_on_desktop):	
		return True
	return False

def getImageElements(imageObject,cC,request):
	imageOut = []
	for image in imageObject:
		if( request.is_phone is image.show_on_mobile and image.show_on_mobile or request.is_tablet is image.show_on_tablet and image.show_on_tablet or request.is_mobile is not image.show_on_desktop and image.show_on_desktop):
			out = image.__dict__
			out["coloum_start"] = (image.coloum_from+0.0)/cC*100
			out["coloum_width"] = (image.coloum_to - image.coloum_from+0.0)/cC*100
			out["type"] = "image"
			out["image"] = get_thumbnailer(image.payload)[getImageSize(request)]
			imageOut.append(out)
	return imageOut	

def getElements(textObject, imageObject,subSections, cc, request, AllTexts, AllImages):
	texts = getTextElements(textObject,cc,request)
	images = getImageElements(imageObject,cc,request)
	sections = []
	if subSections:
		sections = getSubSections(subSections,cc,request, AllTexts, AllImages)
	combined = texts + images + sections
	def numberic_compare(x,y):
		if x["order"] > y["order"]:
			return 1
		elif x["order"] == y["order"]:
			return 0
		else:
			return -1
	combined.sort(numberic_compare)
	return combined

def getSubSections(subSections,cC,request,AllTexts,AllImages):
	sectionsOut = []
	for section in subSections:
		texts = AllTexts.filter(parent = section)
		images = AllImages.filter(parent = section)
		smallout = section.__dict__
		smallout["coloum_start"] = (section.coloum_from+0.0)/cC*100
		smallout["coloum_width"] = (section.coloum_to - section.coloum_from+0.0)/cC*100
		smallout["content"] = getRows(texts,images,None,section.coloum_count,request,None,None)
		smallout["section"] = True

		sectionsOut.append(smallout)
	return sectionsOut

def getRows(textObject,imageObject,subSections,cc, request, AllTexts, AllImages):
	allElements = getElements(textObject,imageObject,subSections,cc, request, AllTexts, AllImages)
	sortedEl = []
	lastOrder = -1;
	for el in allElements:
		if el["order"] == lastOrder :
			sortedEl[len(sortedEl)-1].append(el)
		else:
			lastOrder = el["order"]
			sortedEl.append([el])
	return sortedEl

def getSections(request,sections,meta):
	out = []
	AllTexts = Text.objects.all().order_by('order')
	AllImages = Image.objects.all().order_by('order')
	AllSections = Section.objects.all().order_by('order')	

	for section in sections:
		if( request.is_phone is section.show_on_mobile and section.show_on_mobile or request.is_tablet is section.show_on_tablet and section.show_on_tablet or request.is_mobile is not section.show_on_desktop and section.show_on_desktop):					
			texts = AllTexts.filter(parent = section)
			images = AllImages.filter(parent = section)
			subSections = AllSections.filter(sectionField = section)

			section = section.__dict__			

			section["coloum_start"] = (section["coloum_from"]+0.0)/section["coloum_count"]*100
			section["coloum_width"] = (section["coloum_to"] - section["coloum_from"]+0.0)/section["coloum_count"]*100
			section["rows"] = getRows(texts,images,subSections,section["coloum_count"],request,AllTexts,AllImages);
			out.append(section)
	return out

def get(request,get = None):
	page = Page.objects.order_by("order").all()
	pages,thisPage = getAllPages(page,get)

	sections = Section.objects.filter(parent=thisPage).order_by('order')

	meta = {
		"title":thisPage.title,
		"slug":thisPage.slug,
		"pages":pages,
	}
	if(thisPage.backgroundImage):
		meta["bk"] = get_thumbnailer(thisPage.backgroundImage)['desktop']

	out = getSections(request,sections,meta)

	return render_to_response('main/subpage.html',{"data":out,"meta":meta,"MEDIA_URL":settings.MEDIA_URL})











