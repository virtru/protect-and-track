import pytest
from flaky import flaky
from pytest_bdd import scenario


# Scenarios

@scenario('../features/sdk_website.feature', 'Encrypt file in Protect and Track demo site', example_converters=dict(filename=str))
def test_sdk_website_encrypt_file(current_test):
    pass
