import boto3
import json
import os
from botocore.exceptions import ClientError
import requests

# Constants
S3_BUCKET_NAME = 'sexybucket101'
S3_REGION = 'us-east-1'
IMG_PATH = './Images/'
HTTP_OK = 200

# Create an S3 client
s3 = boto3.client('s3', region_name=S3_REGION)


def download_image_from_url(file_path, image_url):
    """Download an image from the given URL and save it to the specified file path."""
    response = requests.get(image_url)

    if response.status_code == HTTP_OK:
        with open(file_path, 'wb') as file:
            file.write(response.content)
            file.close()


def upload_image_to_s3(file_path, file_name, image_url):
    """Upload an image from the given file path to an existing S3 bucket."""
    try:
        s3.upload_file(file_path, S3_BUCKET_NAME, file_name)
        print(f"Image: '{image_url}'\nUploaded to S3 bucket: '{S3_BUCKET_NAME}'\n File name: '{file_name}'.\n")
    except ClientError as e:
        print(f"Error uploading image '{image_url}' to S3 bucket '{S3_BUCKET_NAME}': {e}")


def process_images_from_json(json_file_path):
    """Load data from a JSON file, download images, and upload them to an S3 bucket."""

    # Load data from the JSON file
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    # Process each item in the data
    for item in data['songs']:
        title = item['title']
        artist = item['artist']
        year = item['year']
        web_url = item['web_url']
        img_url = item['img_url']

        file_name = f"{title}-{artist}.jpg"
        file_path = os.path.join(IMG_PATH, file_name)

        download_image_from_url(file_path, img_url)
        upload_image_to_s3(file_path, file_name, img_url)


if __name__ == "__main__":
    process_images_from_json('a1.json')
