import logging

def setup_logger():
    logger = logging.getLogger("app_logger")
    logger.setLevel(logging.INFO)

    # File handler
    file_handler = logging.FileHandler("logs/app.log")
    file_handler.setLevel(logging.INFO)

    # Format
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )
    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)

    return logger