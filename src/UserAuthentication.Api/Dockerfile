FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["UserAuthentication.Api.csproj", "./"]
RUN dotnet restore "UserAuthentication.Api.csproj"

COPY . .
RUN dotnet publish "UserAuthentication.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "UserAuthentication.Api.dll"]