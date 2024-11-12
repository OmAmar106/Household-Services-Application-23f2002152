from celery import Celery

cel = Celery("app")
cel.config_from_object("Jobs.celeryconfig")

