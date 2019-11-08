import pytest
from flaky import flaky
from pytest_bdd import scenario


# Scenarios


@pytest.mark.since_app_version(version='6.46.0', app='SR')
@pytest.mark.environments(['production', 'staging'])
@scenario('../features/sdk_website.feature', 'Decrypt TDF3 file in SR', example_converters=dict(filename=str))
def test_decrypt_tdf3_file_in_sr(current_test):
    pass

# Scenarios

@scenario('../features/sdk_website.feature', 'Test with Ken', example_converters=dict(filename=str))
def test_with_ken(current_test):
    pass