# tests/conftest.py

def pytest_emoji_passed(config):
    return "🍪 ", "PASSED 🍪 "

def pytest_emoji_failed(config):
    return "😿 ", "FAILED 😿 "

def pytest_emoji_skipped(config):
    return "🙈 ", "SKIPPED 🙈 "

def pytest_emoji_error(config):
    return "💩 ", "ERROR 💩 "

def pytest_emoji_xfailed(config):
    return "🤓 ", "XFAIL 🤓 "

def pytest_emoji_xpassed(config):
    return "😜 ", "XPASS 😜 "