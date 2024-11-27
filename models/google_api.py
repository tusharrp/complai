import requests

api_key = 'AIzaSyBJqN_UEFCjZE2XzuCY4UJy9IwGLEw-UTc'
api_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}'

def generate_text(prompt):
    headers = {
        'Content-Type': 'application/json',
    }
    data = {
        'contents': [
            {
                'parts': [
                    {'text': prompt}
                ]
            }
        ]
    }
    response = requests.post(api_url, headers=headers, json=data)
    if response.status_code != 200:
        error_message = f"Error: Received status code {response.status_code}. Response: {response.text}"
        raise Exception(error_message)
    
    response_json = response.json()
    
    if 'candidates' not in response_json:
        error_message = "Error generating text. Unexpected response format."
        raise Exception(error_message)
    
    generated_text = response_json['candidates'][0]['content']['parts'][0]['text']
    return generated_text

def call_google_api(prompt):
    return generate_text(prompt)