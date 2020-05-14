
/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */

import java.lang.String

import com.kms.katalon.core.testobject.TestObject

import com.kms.katalon.core.testdata.TestData


def static "browse.Navigate.toUrl"(
    	String url	) {
    (new browse.Navigate()).toUrl(
        	url)
}

def static "input.Date.fromText"(
    	TestObject object	
     , 	String value	) {
    (new input.Date()).fromText(
        	object
         , 	value)
}

def static "data.Wait.forSelectPopulation"(
    	TestObject object	) {
    (new data.Wait()).forSelectPopulation(
        	object)
}

def static "data.Wait.forUrlChange"(
    	String originalUrl	) {
    (new data.Wait()).forUrlChange(
        	originalUrl)
}

def static "data.Read.fromDataFiles"(
    	TestData object	) {
    (new data.Read()).fromDataFiles(
        	object)
}
