# ---- build stage ----
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace

# Copy only what's needed to resolve dependencies first, so this layer is cached
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B dependency:go-offline

COPY src src
# Tests run in the CI pipeline, not in the image build
RUN ./mvnw -B package -DskipTests

# ---- runtime stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --from=build /workspace/target/*.jar app.jar
USER app

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]