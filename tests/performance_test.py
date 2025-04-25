import time
import requests
import statistics
import matplotlib.pyplot as plt

def measure_response_time(url, num_requests=100):
    response_times = []
    
    for _ in range(num_requests):
        start_time = time.time()
        response = requests.get(url)
        end_time = time.time()
        
        if response.status_code == 200:
            response_times.append(end_time - start_time)
    
    return response_times

def analyze_performance(response_times):
    avg_time = statistics.mean(response_times)
    median_time = statistics.median(response_times)
    min_time = min(response_times)
    max_time = max(response_times)
    p95 = sorted(response_times)[int(len(response_times) * 0.95)]
    
    print(f"Average response time: {avg_time:.4f} seconds")
    print(f"Median response time: {median_time:.4f} seconds")
    print(f"Min response time: {min_time:.4f} seconds")
    print(f"Max response time: {max_time:.4f} seconds")
    print(f"95th percentile: {p95:.4f} seconds")
    
    # Plot histogram
    plt.figure(figsize=(10, 6))
    plt.hist(response_times, bins=20, alpha=0.7, color='blue')
    plt.axvline(avg_time, color='red', linestyle='dashed', linewidth=1, label=f'Mean: {avg_time:.4f}s')
    plt.axvline(p95, color='green', linestyle='dashed', linewidth=1, label=f'95th percentile: {p95:.4f}s')
    plt.xlabel('Response Time (seconds)')
    plt.ylabel('Frequency')
    plt.title('API Response Time Distribution')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('performance_results.png')
    plt.close()

if __name__ == "__main__":
    url = "http://localhost:3000/"  # Adjust to your backend URL
    print(f"Testing performance of {url}")
    
    response_times = measure_response_time(url)
    analyze_performance(response_times)