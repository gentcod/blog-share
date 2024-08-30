### Deployment Decisions

###
#### Architecture Choice
- **Cloud Provider**: Google Cloud with Cloud Run.
- **Containerization**: application is containerized using Docker.
- **Serverless**: leveraging Cloud Run for a fully managed, serverless environment. Based on traffic requirements as stated in assessment documentation. Resource is provisioned in europe-west1 on Google Cloud
- **Database**: MongoDB with referencing instead of embedding the blogs created by individual users as blogs are accessed individually. Blog content often includes varied and nested data, such as tags, comments, and metadata, which MongoDB handles effectively without requiring a rigid schema. However the Schema for the API was simplified to include just the title, post and author. 

#### Reasoning
- **Serverless Efficiency**: automatically manages infrastructure, scaling, and capacity.
- **Cost-Effective**: only pay for the compute time used or time which the resource is being accessed, in this case the API calls..
- **Scalability**: automatically scales based on traffic with the assumption that blogging won’t be done regularly and by every employee
- **Portability**: due to the lightweight provision that containerized applications provide. There is ease in migrating to other cloud service providers.

#### Benefits
- **Managed Infrastructure**: no server management required.
- **Ease of Deployment**: deploy directly from a container registry.
- **High Availability**: services ensure high availability with automatic traffic distribution.

#### Limitations
- **Cold Start**: Possible latency on the first request after idle time.
- **Limited Customization**: Less control over infrastructure.
- **Service Limits**: Constraints on execution time and concurrent requests.

#### Scaling Strategies
- **Auto-Scaling**: automatically scale based on traffic with Cloud Run.
- **Load Balancing**: utilize Google Cloud load balancing service provisions.

###
I created a deploy.yaml file declaration in the `/github-ci-reference` directory for the ci-workflow for ensuring continuous delivery, I commented out the declarations to avoid the GitHub action running. This can be referenced in the GitHub repo.

I also created a docker-compose.yaml reference in the `/docker-reference` directory.
