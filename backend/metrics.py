import psutil

def get_system_metrics():
    cpu_percent = psutil.cpu_percent(interval=1)
    memory = psutil.virtual_memory()

    return {
        "cpu": cpu_percent,
        "memory_percent": memory.percent,
        "total_memory": round(memory.total / (1024 ** 3), 2),  # in GB
        "used_memory": round(memory.used / (1024 ** 3), 2)
    }

