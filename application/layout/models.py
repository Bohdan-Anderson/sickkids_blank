from django.db import models
# from media_library.models import Image
from easy_thumbnails.fields import ThumbnailerImageField
from easy_thumbnails.files import get_thumbnailer
from django.template.defaultfilters import slugify
import datetime
import os.path
SITE_ROOT = os.path.dirname(os.path.realpath(__file__))


class Style(models.Model):
	title = models.CharField(max_length = 100)
	slug = models.SlugField(blank=True)
	style = models.CharField(max_length = 500, blank=True)
	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(PageStyle, self).save(*args, **kwargs)

class Page(models.Model):
	title = models.CharField(max_length = 300)
	slug = models.SlugField(blank=True)
	order = models.IntegerField(default=1)
	# number_of_coloums = models.IntegerField(default=8)
	backgroundImage = ThumbnailerImageField(upload_to='background_page/',blank=True)
	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)
	style = models.ManyToManyField(Style,blank=True)

	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(Page, self).save(*args, **kwargs)

	def showBackground(self):
		if self.backgroundImage:
			return '<img style="width:300px;height:auto;" src="/%s"/>' % get_thumbnailer(self.backgroundImage.image)['preview'].url
		return "not an image"

	showBackground.short_description = 'BackgroundImage'
	showBackground.allow_tags = True

	def __unicode__(self):
		return self.title



class Section(models.Model):
	parent = models.ForeignKey(Page, null=True)
	style = models.ManyToManyField(Style,blank=True)

	title = models.CharField(max_length = 300)
	show_title = models.BooleanField(default=True)
	subTitle = models.CharField(max_length = 300)
	show_subTitle = models.BooleanField(default=True)
	show_in_sidebar = models.BooleanField(default=True)

	order = models.IntegerField(default=1)
	pub_date = models.DateTimeField(auto_now=True)
	slug = models.SlugField(blank=True)
	coloum_from = models.IntegerField(default=0)
	coloum_to = models.IntegerField(default=8)
	coloum_count = models.IntegerField(default=8)

	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)

	subTitle = models.CharField(max_length = 600,blank=True)
	backgroundImage = ThumbnailerImageField(upload_to='background_section/',blank=True)
	fullPage = models.BooleanField(default=False)

	sectionField = models.ForeignKey("self", null=True)

	show_on_desktop = models.BooleanField(default=True)
	show_on_tablet = models.BooleanField(default=True)
	show_on_mobile = models.BooleanField(default=True)

	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(Section, self).save(*args, **kwargs)

	def showBackground(self):
		if self.backgroundImage:
			return '<img style="width:200px;height:auto;" src="/%s"/>' % get_thumbnailer(self.backgroundImage.image)['preview'].url
		return "not an image"

	showBackground.short_description = 'BackgroundImage'
	showBackground.allow_tags = True
	def __unicode__(self):
		return self.title


class Text(models.Model):
	parent = models.ForeignKey(Section)
	paragraph = models.TextField()
	title = models.CharField(max_length = 300,default="notitle")
	show_title = models.BooleanField(default=True)
	subTitle = models.CharField(max_length = 600,blank=True)
	show_subTitle = models.BooleanField(default=True)	

	coloum_from = models.IntegerField(default=0)
	coloum_to = models.IntegerField(default=8)
	style = models.ManyToManyField(Style,blank=True)

	order = models.IntegerField(default=1)
	date_changed = models.DateTimeField(auto_now=True)

	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)

	show_on_desktop = models.BooleanField(default=True)
	show_on_tablet = models.BooleanField(default=True)
	show_on_mobile = models.BooleanField(default=True)

	def save(self, *args, **kwargs):
		datechanged = datetime.datetime.today()
		self.slug = slugify(self.title)
		super(Text, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.subTitle	


class Image(models.Model):
	parent = models.ForeignKey(Section)
	payload = ThumbnailerImageField(upload_to='image/')
	order = models.IntegerField(default=1)
	datechanged = models.DateTimeField(auto_now=True)
	coloum_from = models.IntegerField(default=0)
	coloum_to = models.IntegerField(default=8)
	alternate_info = models.CharField(max_length = 300)
	style = models.ManyToManyField(Style,blank=True)
	image_height = models.IntegerField(default=0)
	image_width = models.IntegerField(default=0)

	created_at = models.DateTimeField(auto_now_add = True)
	updated_at = models.DateTimeField(auto_now = True)

	show_on_desktop = models.BooleanField(default=True)
	show_on_tablet = models.BooleanField(default=True)
	show_on_mobile = models.BooleanField(default=True)

	show_downloader = models.BooleanField(default=False)
	file_downloader = models.FileField(upload_to='fileupload/',blank=True)

	def showImage(self):
		if self.payload:
			return '<img style="width:200px;height:auto;" src="/%s"/>' % get_thumbnailer(self.payload.image)['preview'].url
		return "not an image"

	showImage.short_description = 'Image'
	showImage.allow_tags = True

	def __unicode__(self):
		return self.payload	


class Visualization(models.Model):
	parent = models.ForeignKey(Section)

	title = models.CharField(max_length = 300,default="NO_TITLE")
	show_title = models.BooleanField(default=True)
	subTitle = models.CharField(max_length = 600,blank=True)
	show_subTitle = models.BooleanField(default=True)	

	order = models.IntegerField(default=1)
	coloum_from = models.IntegerField(default=0)
	coloum_to = models.IntegerField(default=8)	
	style = models.ManyToManyField(Style,blank=True)

	data = models.TextField()
	script = models.TextField()
	fall_back_image = ThumbnailerImageField(upload_to='vizfallback/')

	interact_box = models.BooleanField(default=True)
	inter_coloum_from = models.IntegerField(default=0)
	inter_coloum_to = models.IntegerField(default=8)

	feedback_box = models.BooleanField(default=True)
	feed_inter_coloum_from = models.IntegerField(default=0)
	feed_inter_coloum_to = models.IntegerField(default=8)	

	show_on_desktop = models.BooleanField(default=True)
	show_on_tablet = models.BooleanField(default=True)
	show_on_mobile = models.BooleanField(default=True)

	show_image_on_desktop = models.BooleanField(default=True)
	show_image_on_tablet = models.BooleanField(default=True)
	show_image_on_mobile = models.BooleanField(default=True)	

	def save(self, *args, **kwargs):
		self.slug = slugify(self.title)
		super(Visualization, self).save(*args, **kwargs)


	def feedback_slug(self):
		return "feed-%s" %slugify(self.title)
	feedback_slug.short_description = 'Feedback id'
	feedback_slug.allow_tags = True

	def interact_slug(self):
		return "inter-%s" %slugify(self.title)
	interact_slug.short_description = 'Interact id'
	interact_slug.allow_tags = True

	def showImage(self):
		if self.fall_back_image:
			return '<img style="width:200px;height:auto;" src="/%s"/>' % get_thumbnailer(self.fall_back_image.image)['preview'].url
		return "not an image"
	showImage.short_description = 'Image'
	showImage.allow_tags = True	

	def __unicode__(self):
		return self.title	




