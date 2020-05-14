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
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

CustomKeywords.'browse.Navigate.toUrl'(GlobalVariable.URL.concat('/Pages/Advisors/Reports.aspx'))

WebUiBuiltInKeywords.click(findTestObject('Reports/Advisor/lnk_ABSA Protected Account Policy Summary'), FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'input.Date.fromText'(findTestObject('Reports/Advisor/txt_FromDate'), GlobalVariable.TestValues['FromDate'])

CustomKeywords.'input.Date.fromText'(findTestObject('Reports/Advisor/txt_ToDate'), GlobalVariable.TestValues['ToDate'])

CustomKeywords.'data.Wait.forSelectPopulation'(findTestObject('Reports/Advisor/sel_AdvisorListValue'))

WebUI.selectOptionByIndex(findTestObject('Reports/Advisor/sel_AdvisorList'), Integer.valueOf(GlobalVariable.TestValues['AdvisorIndex']), 
    FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Reports/Advisor/btn_Submit'), FailureHandling.STOP_ON_FAILURE)

