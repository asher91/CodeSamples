package internal

import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase

/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */
public class GlobalVariable {
     
    /**
     * <p></p>
     */
    public static Object PID
     
    /**
     * <p></p>
     */
    public static Object Username
     
    /**
     * <p></p>
     */
    public static Object URL
     
    /**
     * <p></p>
     */
    public static Object TestValues
     

    static {
        def allVariables = [:]        
        allVariables.put('default', ['PID' : 1, 'Username' : '', 'URL' : '', 'TestValues' : [:]])
        allVariables.put('ITR LOCAL', allVariables['default'] + ['PID' : 17])
        allVariables.put('ITR SIT', allVariables['default'] + ['PID' : 18])
        
        String profileName = RunConfiguration.getExecutionProfile()
        
        def selectedVariables = allVariables[profileName]
        PID = selectedVariables['PID']
        Username = selectedVariables['Username']
        URL = selectedVariables['URL']
        TestValues = selectedVariables['TestValues']
        
    }
}
