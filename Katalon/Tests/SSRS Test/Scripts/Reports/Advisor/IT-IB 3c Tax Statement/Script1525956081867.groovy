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

WebUiBuiltInKeywords.navigateToUrl(GlobalVariable.URL.concat('/Pages/Advisors/Reports.aspx'), FailureHandling.STOP_ON_FAILURE)

WebUiBuiltInKeywords.click(findTestObject('Reports/Advisor/lnk_IT-IB 3c Tax Statement'), FailureHandling.STOP_ON_FAILURE)

WebUI.selectOptionByValue(findTestObject('Reports/Advisor/sel_Year'), GlobalVariable.TestValues["Year"], false, FailureHandling.STOP_ON_FAILURE)

CustomKeywords.'data.Wait.forSelectPopulation'(findTestObject('Reports/Advisor/sel_AdvisorListValue'))

WebUI.selectOptionByIndex(findTestObject('Reports/Advisor/sel_AdvisorList'), GlobalVariable.TestValues["AdvisorIndex"], FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Reports/Advisor/btn_Submit'), FailureHandling.STOP_ON_FAILURE)

WebUI.selectOptionByValue(findTestObject('Reports/Advisor/sel_Year'), GlobalVariable.TestValues['Year1'], false, FailureHandling.STOP_ON_FAILURE)

WebUI.click(findTestObject('Reports/Advisor/btn_Submit'), FailureHandling.STOP_ON_FAILURE)