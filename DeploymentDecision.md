### Deployment Decisions

#### Architecture Choice
- **Cloud Provider**: Google Cloud with Cloud Run.
- **Containerization**: Application is containerized using Docker.
- **Serverless**: Leveraging Cloud Run for a fully managed, serverless environment.

#### Reasoning
- **Serverless Efficiency**: Automatically manages infrastructure, scaling, and capacity.
- **Cost-Effective**: Only pay for the compute time used.
- **Scalability**: Automatically scales based on traffic.

#### Benefits
- **Managed Infrastructure**: No server management required.
- **Ease of Deployment**: Deploy directly from a container registry.
- **High Availability**: Services ensure high availability with automatic traffic distribution.

#### Limitations
- **Cold Start**: Possible latency on the first request after idle time.
- **Limited Customization**: Less control over infrastructure.
- **Service Limits**: Constraints on execution time and concurrent requests.

#### Scaling Strategies
- **Auto-Scaling**: Automatically scale based on traffic with Cloud Run.
- **Load Balancing**: Utilize Google Cloud
