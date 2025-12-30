---
name: pytest
description: Python testing with pytest. Use for unit tests, fixtures, mocking.
---

# Pytest Skill

## Basic Tests
```python
def test_add():
    assert add(1, 2) == 3

def test_raises():
    with pytest.raises(ValueError):
        validate("")
```

## Fixtures
```python
@pytest.fixture
def user():
    return User(email="test@example.com")

@pytest.fixture
async def db():
    conn = await create_connection()
    yield conn
    await conn.close()

def test_user_email(user):
    assert user.email == "test@example.com"
```

## Parametrize
```python
@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
])
def test_double(input, expected):
    assert double(input) == expected
```

## Mocking
```python
def test_api_call(mocker):
    mocker.patch('module.fetch', return_value={'data': 'test'})
    result = get_data()
    assert result == {'data': 'test'}
```

## Run
```bash
pytest -v
pytest --cov=src
pytest -k "test_user"
```
