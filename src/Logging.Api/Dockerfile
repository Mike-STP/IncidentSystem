FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Logging.Api.csproj", "./"]
RUN dotnet restore "Logging.Api.csproj"

COPY . .
RUN dotnet publish "Logging.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

USER $APP_UID

ENTRYPOINT ["dotnet", "Logging.Api.dll"]