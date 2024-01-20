import requests

def get_user_tasks():
    tasks = []
    while True:
        task = input("Enter a task (or 'done' to finish): ")
        if task.lower() == 'done':
            break
        hours = float(input(f"Enter hours for '{task}': "))
        tasks.append((task, hours))
    return tasks

def create_schedule_with_chatgpt(tasks, api_key):
    url = 'https://api.openai.com/v1/chat/completions'

    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}'
    }

    messages = [{'role': 'system', 'content': 'You are helping the user create a daily schedule given the task and number of hours the task takes. The output should be the schedule. Make sure sleep is at night.'}]
    
    for task, hours in tasks:
        task_message = f"I have a task named '{task}' that will take {hours} hours."
        messages.append({'role': 'user', 'content': task_message})

    data = {
        'messages': messages,
        'model': 'gpt-3.5-turbo'  
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()

        if 'choices' in result and len(result['choices']) > 0:
            assistant_response = result['choices'][0]['message']['content']
            return assistant_response
        else:
            return "No valid response found in the API response."
    else:
        return f"Error: {response.status_code}, {response.text}"

def main():
    tasks = get_user_tasks()
    api_key = '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'

    schedule = create_schedule_with_chatgpt(tasks, api_key)

    if schedule:
        print("Generated Schedule:")
        print(schedule)
    else:
        print("Failed to generate a schedule.")

if __name__ == "__main__":
    main()
