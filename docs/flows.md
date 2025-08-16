# User Flow Diagram

```mermaid
flowchart LR
    Home -->|выбор челленджа| ChallengeDetail
    ChallengeDetail -->|загрузка| Upload
    ChallengeDetail -->|голосование| Vote
    Upload -->|успешно| Vote
    Vote -->|принять участие| Upload
    Vote -->|назад| Home
    Profile -->|загрузка видео| Upload
```
```
