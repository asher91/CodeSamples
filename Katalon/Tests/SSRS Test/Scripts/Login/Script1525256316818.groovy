import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testcase.Variable as Variable
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

GlobalVariable.URL = findTestData('Platform').getValue(2, GlobalVariable.PID)

WebUI.openBrowser(GlobalVariable.URL, FailureHandling.STOP_ON_FAILURE)

WebUiBuiltInKeywords.setText(findTestObject('Login/txt_Username'), findTestData('Platform').getValue(3, GlobalVariable.PID), 
    FailureHandling.STOP_ON_FAILURE)

WebUiBuiltInKeywords.setText(findTestObject('Login/txt_Password'), findTestData('Platform').getValue(4, GlobalVariable.PID), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.check(findTestObject('Login/chk_TnC'), FailureHandling.STOP_ON_FAILURE)

WebUiBuiltInKeywords.click(findTestObject('Login/btn_Login'), FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'data.Wait.forUrlChange'(WebUI.getUrl(FailureHandling.STOP_ON_FAILURE))

