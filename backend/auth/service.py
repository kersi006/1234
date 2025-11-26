from fastapi import HTTPException
from sqlmodel import Session, select

from models.models import User
from auth.security import hash_password, verify_password, create_access_token


class AuthService:

    @staticmethod
    def register(data, session: Session):
        existing = session.exec(select(User).where(User.email == data.email)).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email уже зарегистрирован")

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password)
        )
        session.add(user)
        session.commit()
        session.refresh(user)

        return create_access_token({"sub": str(user.id)})

    @staticmethod
    def login(data, session: Session):
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=400, detail="Неверный email или пароль")

        return create_access_token({"sub": str(user.id)})
