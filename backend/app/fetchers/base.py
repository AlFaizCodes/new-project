from abc import ABC, abstractmethod
from typing import list, dict

class BaseFetcher(ABC):
    @abstractmethod
    async def fetch(self) -> list[dict]:
        pass
